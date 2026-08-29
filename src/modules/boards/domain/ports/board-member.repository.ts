export interface BoardMemberRepository { 
    transferOwnershipt(currentOwner: string, newOwner: string);
}