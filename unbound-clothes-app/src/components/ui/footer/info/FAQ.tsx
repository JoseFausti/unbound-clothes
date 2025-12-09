import Styles from "./Info.module.css";

const FAQ = () => {
  return (
    <div className={Styles.container}>
      <section className={Styles.section}>
        <h1 className={Styles.title}>Frequently Asked Questions</h1>
        <p className={Styles.text}>
          Here you will find answers to the most common questions about Unbound Clothes,
          our products, and our services.
        </p>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.subtitle}>Orders & Shipping</h2>

        <div className={Styles.faqItem}>
          <h3 className={Styles.question}>📦 How long does it take for my order to arrive?</h3>
          <p className={Styles.answer}>
            Shipping usually takes between <strong>3 to 7 business days</strong>,
            depending on your location. During promotions or special dates,
            delivery times may be slightly extended.
          </p>
        </div>

        <div className={Styles.faqItem}>
          <h3 className={Styles.question}>🚚 Do you offer international shipping?</h3>
          <p className={Styles.answer}>
            Yes, we offer international shipping. Costs and delivery times depend on the destination country.
          </p>
        </div>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.subtitle}>Payments</h2>

        <div className={Styles.faqItem}>
          <h3 className={Styles.question}>💳 What payment methods do you accept?</h3>
          <p className={Styles.answer}>
            We accept credit cards, debit cards, PayPal, and bank transfers.
          </p>
        </div>

        <div className={Styles.faqItem}>
          <h3 className={Styles.question}>🔐 Is it safe to make payments on your website?</h3>
          <p className={Styles.answer}>
            Absolutely. We use encrypted payment systems and SSL certificates
            to ensure the security of your data.
          </p>
        </div>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.subtitle}>Returns & Refunds</h2>

        <div className={Styles.faqItem}>
          <h3 className={Styles.question}>↩️ Can I return a product?</h3>
          <p className={Styles.answer}>
            Yes, we accept returns within <strong>30 days</strong> of purchase,
            as long as the product is in perfect condition.
          </p>
        </div>

        <div className={Styles.faqItem}>
          <h3 className={Styles.question}>💰 How do I request a refund?</h3>
          <p className={Styles.answer}>
            You can request a refund by contacting our support team with your order number.
            The process may take 3–5 business days.
          </p>
        </div>
      </section>

      <section className={Styles.section}>
        <h2 className={Styles.subtitle}>Account & Favorites</h2>

        <div className={Styles.faqItem}>
          <h3 className={Styles.question}>❤️ How do I add products to favorites?</h3>
          <p className={Styles.answer}>
            If you have an account, simply click the heart icon on any product.
          </p>
        </div>

        <div className={Styles.faqItem}>
          <h3 className={Styles.question}>🧾 Can I see my past orders?</h3>
          <p className={Styles.answer}>
            Yes, you can access your order history from your profile in the "My Orders" section.
          </p>
        </div>
      </section>

    </div>
  );
};

export default FAQ;
