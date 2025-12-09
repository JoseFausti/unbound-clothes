import Styles from './Loader.module.css'
const Loader = () => {
  return (
    <div className={Styles.loaderContainer}>
      <div className={Styles.spinner}></div>
    </div>
  )
}

export default Loader
