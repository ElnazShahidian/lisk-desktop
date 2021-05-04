import React from 'react';
import Icon from '@toolbox/icon';
import styles from './overview.css';

const NumericInfo = ({ icon, value, title }) => (
  <section className={styles.numericInfo}>
    <Icon name={icon} />
    <main className={styles.main}>
      <h6>{title}</h6>
      <p>{value}</p>
    </main>
  </section>
);

export default NumericInfo;
