import styles from './loading.module.scss';

export default function Loading() {
    return (
        <div className={styles.container}>
            <div className={styles.spinner}></div>
            <p className={styles.text}>
                Carregando transações<span className={styles.dots}></span>
            </p>
        </div>
    );
}

