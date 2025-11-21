import styles from './Footer.module.css';
import logo from './logo.PNG';
import { Mail, Phone, MapPin,Fingerprint,ShieldAlert,BookOpenText} from "lucide-react";




function Footer() {


    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                <div className={styles.grid}>


                    <div className={styles.column}>
                        <img src={logo} alt="Logo" className={styles.logo} />
                    </div>

                    

                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}> Contact</h3>
                        <ul className={styles.linkList}>
                            <li className={styles.iconRow}>
                                <MapPin size={18} className={styles.icon} />
                                <span>University of Moratuwa, Katubedda, Sri Lanka</span>
                            </li>

                            <li className={styles.iconRow}>
                                <Mail size={18} className={styles.icon} />
                                <a href="mailto:info@healthbridge.lk" className={styles.link}>
                                    info@healthbridge.lk
                                </a>
                            </li>

                            <li className={styles.iconRow}>
                                <Phone size={18} className={styles.icon} />
                                <a href="tel:+94112650301" className={styles.link}>+94 11 265 0301</a>
                            </li>

                        </ul>
                    </div>

                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}> Trust & Safety</h3>
                        <ul className={styles.linkList}>
                            <li className={styles.iconRow}>
                                <Fingerprint size={18} className={styles.icon} />
                                 <a href="src/components/Footer/Privacy-Policy.pdf"  target="_blank" className={styles.link}>
                                    Privacy Policy
                                </a>
                            </li>

                            <li className={styles.iconRow}>
                                <BookOpenText size={18} className={styles.icon} />
                                <a href="src/components/Footer/Terms & Conditions.pdf" target="_blank" className={styles.link}>
                                    Terms & Conditions
                                </a>
                            </li> 

                            <li className={styles.iconRow}>
                                <ShieldAlert size={18} className={styles.icon} />
                                <a href="src/components/Footer/Disclaimer.pdf"  target="_blank"  className={styles.link}>Disclaimer</a>
                            </li>

                        </ul>
                    </div>



                </div>


                <div className={styles.copyright}>
                    <p>&copy; {new Date().getFullYear()} HealthBridge. All rights reserved.</p>
                </div>



            </div>
        </footer>
     
      
    );
}

export default Footer;