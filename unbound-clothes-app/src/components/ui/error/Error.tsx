import Styles from './Error.module.css'

interface ErrorProps {
  error?: string
}

const Error: React.FC<ErrorProps> = ({error}) => {
  return (
    <div className={Styles.errorContainer}>
        <h2>Something went wrong</h2>
        <p>Please try again later</p>
        {error && <p>{error}</p>}
    </div>
  )
}

export default Error
