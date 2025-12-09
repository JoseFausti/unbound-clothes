import Styles from './UserImage.module.css'

interface UserImageProps {
  imageUrl: string;
}

const UserImage: React.FC<UserImageProps> = ({imageUrl}) => {
  return (
    <div className={Styles.userImageContainer}>
      <img src={imageUrl} alt="UserImage" className={Styles.profileImage}/>
    </div>
  )
}

export default UserImage
