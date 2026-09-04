import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Notification } from 'src/modules/notifications/domain/entities/notification.entity';
import { NotificationRepository } from 'src/modules/notifications/domain/ports/notification.repository';
import { NotificationMikroEntity } from '../entities/notification.mikro-entity';
import { NotificationMapper } from '../mappers/notification.mapper';

@Injectable()
export class MikroOrmNotificationRepository implements NotificationRepository {
  constructor(private readonly em: EntityManager) {}

  async createMany(notifications: Notification[]): Promise<void> {
    if (notifications.length === 0) {
      return;
    }

    for (const notification of notifications) {
      this.em.create(
        NotificationMikroEntity,
        NotificationMapper.toPersistence(notification),
      );
    }
    // Un solo flush para todo el lote: comentar en una tarjeta con varios
    // participantes no debe costar una transacción por destinatario.
    await this.em.flush();
  }

  async findByUser(userId: string): Promise<Notification[]> {
    const rows = await this.em.find(
      NotificationMikroEntity,
      { user: userId },
      { populate: ['user', 'actor'], orderBy: { createdAt: 'desc' } },
    );
    return rows.map((row) => NotificationMapper.toDomain(row));
  }

  async findById(notificationId: string): Promise<Notification | null> {
    const row = await this.em.findOne(
      NotificationMikroEntity,
      { id: notificationId },
      { populate: ['user', 'actor'] },
    );
    return row ? NotificationMapper.toDomain(row) : null;
  }

  async update(notification: Notification): Promise<Notification> {
    const row = await this.em.findOne(
      NotificationMikroEntity,
      { id: notification.id },
      { populate: ['user', 'actor'] },
    );
    if (!row) {
      throw new Error('Notification not found');
    }

    this.em.assign(row, NotificationMapper.toPersistence(notification));
    await this.em.flush();
    return NotificationMapper.toDomain(row);
  }

  async markAllAsRead(userId: string): Promise<number> {
    return this.em.nativeUpdate(
      NotificationMikroEntity,
      { user: userId, readAt: null },
      { readAt: new Date() },
    );
  }
}
