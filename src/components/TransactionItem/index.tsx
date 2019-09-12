import React from 'react'
import { Link } from 'react-router-dom'
import RightArrowIcon from '../../assets/input_arrow_output.png'
import DownArrowIcon from '../../assets/input_arrow_output_down.png'
import { parseDate } from '../../utils/date'
import { localeNumberString } from '../../utils/number'
import { isLargeMobile, isMediumMobile, isMobile, isSmallMobile } from '../../utils/screen'
import { startEndEllipsis } from '../../utils/string'
import TransactionCell from './TransactionItemCell'
import TransactionCellList from './TransactionItemCellList'
import TransactionConfirmation from './TransactionConfirmation'
import TransactionReward from './TransactionReward'
import { FullPanel, TransactionHashBlockPanel, TransactionCellPanel, TransactionPanel } from './styled'
import i18n from '../../utils/i18n'
import { CellType } from '../../utils/const'

const handleTransactionHashText = (transactionHash: string) => {
  if (isSmallMobile()) {
    return startEndEllipsis(transactionHash, 12)
  }
  if (isMediumMobile()) {
    return startEndEllipsis(transactionHash, 19)
  }
  if (isLargeMobile()) {
    return startEndEllipsis(transactionHash, 24)
  }
  return transactionHash
}

const TransactionItem = ({
  transaction,
  address,
  confirmation,
  isBlock = false,
  isLastItem = false,
}: {
  transaction: State.Transaction
  address?: string
  confirmation?: number
  isBlock?: boolean
  isLastItem?: boolean
}) => {
  return (
    <TransactionPanel isLastItem={isLastItem}>
      <TransactionHashBlockPanel>
        <div className="transaction_item__content">
          <Link to={`/transaction/${transaction.transactionHash}`}>
            <code className="transaction_item__hash">{handleTransactionHashText(transaction.transactionHash)}</code>
          </Link>
          {!isBlock && (
            <div className="transaction_item__block">
              {`(${i18n.t('block.block')} ${localeNumberString(transaction.blockNumber)})  ${parseDate(
                transaction.blockTimestamp,
              )}`}
            </div>
          )}
        </div>
      </TransactionHashBlockPanel>
      <TransactionCellPanel>
        <div className="transaction_item__input">
          <TransactionCellList
            cells={transaction.displayInputs}
            transaction={transaction}
            render={cell => <TransactionCell cell={cell} address={address} cellType={CellType.Input} key={cell.id} />}
          />
        </div>
        <img src={isMobile() ? DownArrowIcon : RightArrowIcon} alt="input and output" />
        <div className="transaction_item__output">
          <TransactionCellList
            cells={transaction.displayOutputs}
            transaction={transaction}
            render={cell => (
              <FullPanel key={cell.id}>
                <TransactionCell cell={cell} address={address} cellType={CellType.Output} />
                <TransactionReward transaction={transaction} cell={cell} />
              </FullPanel>
            )}
          />
        </div>
      </TransactionCellPanel>
      {confirmation && <TransactionConfirmation confirmation={confirmation} income={transaction.income} />}
    </TransactionPanel>
  )
}

export default TransactionItem
