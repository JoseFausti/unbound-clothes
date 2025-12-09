import { useSearchParams } from "react-router-dom";
import Styles from "./Info.module.css";
import AboutUs from "./AboutUs";
import Contact from "./Contact";
import FAQ from "./FAQ";

const Info = () => {

    const q = useSearchParams()[0].get("q");

    const handleRenderContent = (query: string | null) => {
        switch (query) {
            case "about":
                return <AboutUs />
            case "contact":
                return <Contact />
            case "faq":
                return <FAQ />
            default:
                return <></>
        }
    }

  return (
    <div className={Styles.infoContainer}>
        {q
            ?
            handleRenderContent(q)
            :
            <>
                <h2 className={Styles.title}>Information</h2>
                <p className={Styles.text}>Please select a topic to learn more about Unbound Clothes.</p>
            </>
        }
    </div>
  )
}

export default Info
