import styles from './ActionControl.module.css';

export enum Action {
  FILL,
  ERASE,
  MOVE,
  CLEAR,
}

interface Props {
  action: Action;
  onActionSet: (action: Action) => void;
}

export default function ActionControl({ action, onActionSet }: Props) {
  return (
    <div className={styles.ActionControl}>
      <div className={styles.SelectButtonContainer}>
        <div className={styles.ButtonContainer}>
          <div
            className={styles.Button + (action === Action.FILL ? ` ${styles.Selected}` : '')}
            onClick={() => onActionSet(Action.FILL)}>
            <div className={styles.Fill} />
          </div>
        </div>
        <div className={styles.ButtonContainer}>
          <div
            className={styles.Button + (action === Action.ERASE ? ` ${styles.Selected}` : '')}
            onClick={() => onActionSet(Action.ERASE)}>
            <div className={styles.Erase} />
          </div>
        </div>
        <div className={styles.ButtonContainer}>
          <div
            className={styles.Button + (action === Action.MOVE ? ` ${styles.Selected}` : '')}
            onClick={() => onActionSet(Action.MOVE)}>
            <svg className={styles.Move} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 3V9M12 3L9 6M12 3L15 6M12 15V21M12 21L15 18M12 21L9 18M3 12H9M3 12L6 15M3 12L6 9M15 12H21M21 12L18 9M21 12L18 15" stroke="#dedede" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
      <div
        className={styles.ClearButton}
        onClick={() => onActionSet(Action.CLEAR)}>Clear</div>
    </div>
  );
}
