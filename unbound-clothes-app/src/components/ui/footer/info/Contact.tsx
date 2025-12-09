import Styles from "./Info.module.css";

const Contact = () => {
  return (
    <div className={Styles.container}>
      <section className={Styles.section}>
        <h1 className={Styles.title}>Contact Us</h1>
        <p className={Styles.text}>
          Do you have questions, suggestions, or need assistance?  
          At <strong>Unbound Clothes</strong>, we're here to help.  
          You can reach us through the following channels:
        </p>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.subtitle}>Contact Information</h2>

        <div className={Styles.contactItem}>
          <strong>Phone:</strong> +1 (555) 123-4567
        </div>

        <div className={Styles.contactItem}>
          <strong>Customer Service Hours:</strong>  
          Monday to Friday — 9:00 AM to 6:00 PM (GMT-3)
        </div>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.subtitle}>Social Media</h2>
        <p className={Styles.text}>Follow us to stay updated on news, discounts, and drops:</p>

        <ul className={Styles.list}>
          <li>📸 Instagram: @unboundclothes</li>
          <li>🐦 Twitter/X: @unboundclothes</li>
          <li>📘 Facebook: Unbound Clothes</li>
        </ul>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.subtitle}>Inquiry Form</h2>
        <p className={Styles.text}>Soon you’ll be able to contact us directly from here.</p>
      </section>

    </div>
  );
};

export default Contact;
