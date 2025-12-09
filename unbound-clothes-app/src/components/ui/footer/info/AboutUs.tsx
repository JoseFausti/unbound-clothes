import Styles from "./Info.module.css";

const AboutUs = () => {
  return (
    <div className={Styles.container}>
      <section className={Styles.section}>
        <h1 className={Styles.title}>About Us</h1>
        <p className={Styles.text}>
          Welcome to <strong>Unbound Clothes</strong>, an e-commerce platform 
          designed to offer a modern, fast, and reliable online clothing 
          shopping experience. Our goal is to connect sellers with customers 
          through an intuitive, secure, and fully optimized platform.
        </p>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.subtitle}>Our Mission</h2>
        <p className={Styles.text}>
          To democratize access to fashion by empowering independent sellers 
          and providing users with a simple, transparent, and enjoyable 
          shopping experience.
        </p>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.subtitle}>What We Offer</h2>
        <ul className={Styles.list}>
          <li>✨ Fast and responsive platform</li>
          <li>🛍️ Products from multiple sellers</li>
          <li>🔒 Secure authentication and transactions</li>
          <li>📦 Efficient stock and discount management</li>
          <li>❤️ Favorites system and personalized experience</li>
        </ul>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.subtitle}>Our Commitment</h2>
        <p className={Styles.text}>
          At Unbound Clothes, we continuously work to improve our 
          infrastructure, ensure cloud availability, and deliver a scalable 
          platform that grows alongside our users and sellers.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
