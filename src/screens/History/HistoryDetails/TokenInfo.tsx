import { FC } from "react";
import { TokenType, TransactionType } from "../internal";

interface TokenInfoProps {
    transactionType: TransactionType;
    tokenType: TokenType;
    tokenImage: string;
    tokenName: string;
    amount: number;
    receiveAmount?: string;
    receivedTokenImage?: string;
    receivedTokenName?: string;
}

const TokenInfo: FC<TokenInfoProps> = ({transactionType, tokenType, amount,tokenImage, tokenName,receiveAmount,receivedTokenImage,receivedTokenName}) => {


    return (
        
    );
}

export default TokenInfo;