"use client";

import styles from "./SubmitConfirmModal.module.css";

type Props = {
  isOpen: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function SubmitConfirmModal({ isOpen, isSubmitting, onCancel, onSubmit }: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>試験の提出</h2>
        <p className={styles.message}>
          最後の問題まで到達しました。<br />
          試験を終了して、採点結果を確認しますか？
        </p>
        <div className={styles.actions}>
          <button 
            className={styles.cancelBtn} 
            onClick={onCancel} 
            disabled={isSubmitting}
          >
            キャンセル
          </button>
          <button 
            className={styles.submitBtn} 
            onClick={onSubmit} 
            disabled={isSubmitting}
          >
            提出して採点する
          </button>
        </div>
      </div>
    </div>
  );
}
