export default async function Footer() {
    return (
      <footer className="footer p-10 bg-base-200 text-base-content">
      <div>
        <span className="footer-title">Features</span> 
        <a className="link link-hover">Online CRM</a> 
        <a className="link link-hover">Project Management</a> 
        <a className="link link-hover">Task Management</a> 
        <a className="link link-hover">Financial Management</a>
      </div> 
      <div>
        <span className="footer-title">Solutions</span> 
        <a className="link link-hover">IT Departments</a> 
        <a className="link link-hover">Business Consultants</a> 
        <a className="link link-hover">Legal Professionals</a> 
        <a className="link link-hover">Exchange Development</a>
      </div> 
      <div>
        <span className="footer-title">Pricing</span> 
        <a className="link link-hover">Terms of use</a> 
        <a className="link link-hover">Privacy policy</a> 
        <a className="link link-hover">Public Roadmap</a>
      </div> 
      <div>
        <span className="footer-title">Newsletter</span> 
        <div className="form-control w-80">
          <label className="label">
            <span className="label-text">Enter your email address</span>
          </label> 
          <div className="relative">
            <input type="text" placeholder="username@site.com" className="input input-bordered w-full pr-16" /> 
            <button className="btn btn-primary absolute top-0 right-0 rounded-l-none">Subscribe</button>
          </div>
        </div>
      </div>
    </footer>
    );
  }

