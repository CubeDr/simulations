import { useEffect, useState } from 'react';
import styles from './ActionControl.module.css';

export enum Action {
  FILL,
  ERASE,
  CLEAR,
}

interface Props {
  action: Action;
  onActionSet: (action: Action) => void;
}

export default function ActionControl({ action, onActionSet }: Props) {
  const [selected, setSelected] = useState<Action>(action);

  useEffect(() => {
    onActionSet(selected);
  }, [onActionSet, selected]);

  return (
    <div className={styles.ActionControl}>
      <div className={styles.SelectButtonContainer}>
        <div className={styles.ButtonContainer}>
          <div
            className={styles.Button + (selected === Action.FILL ? ` ${styles.Selected}` : '')}
            onClick={() => setSelected(Action.FILL)}>
            <div className={styles.Fill} />
          </div>
        </div>
        <div className={styles.ButtonContainer}>
          <div
            className={styles.Button + (selected === Action.ERASE ? ` ${styles.Selected}` : '')}
            onClick={() => setSelected(Action.ERASE)}>
            <div className={styles.Erase} />
          </div>
        </div>
      </div>
      <div
        className={styles.ClearButton}
        onClick={() => onActionSet(Action.CLEAR)}>Clear</div>
    </div>
  );
}
