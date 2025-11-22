import styles from './login.module.css';


function Login() {
    return (
        <div className={styles.loginContainer}>
            
            <form className={styles.loginForm}>
                <h2 className={styles.title}>Login</h2>
                <label className={styles.label}>
                    Username:
                    <input type="text" className={styles.input} />
                </label>
                
                <label className={styles.label}>
                    Password:
                    <input type="password" className={styles.input} />
                </label>
                
                <label className={styles.errorMessage} id="errorMessage">{}</label>
                <button type="submit" className={styles.loginButton}>Submit</button>
                
            </form>
            
        </div>
    );
}
export default Login;