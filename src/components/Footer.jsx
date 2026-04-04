import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-base-200 text-base-content text-sm">

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="grid md:grid-cols-4 gap-x-20">

          {/* Brand */}
          <div>
            <h2 className="text-lg font-semibold text-blue-500">
              DevTinder 👩‍💻
            </h2>
            <p className="mt-1 opacity-70">
              Connect & collaborate with developers.
            </p>

            {/* Social */}
            <div className="flex gap-4 mt-2">
              <a href="#" className="hover:text-primary">GitHub</a>
              <a href="#" className="hover:text-primary">LinkedIn</a>
            </div>
          </div>

          {/* Developers */}
          <div>
            <h3 className="font-medium mb-2">Developers</h3>
            <ul className="space-y-1">
              <li><Link to="/explore" className="hover:text-primary">Explore Profiles</Link></li>
              <li><Link to="/how-it-works" className="hover:text-primary">How it Works</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-medium mb-2">Company</h3>
            <ul className="space-y-1">
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-medium mb-2">Legal</h3>
            <ul className="space-y-1">
              <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Full Width Divider */}
      <div className="border-t border-base-300">
        <div className="max-w-6xl mx-auto px-6 py-2 text-center text-xs opacity-70">
          © {new Date().getFullYear()} DevTinder. Built with ❤️ by developers.
        </div>
      </div>

    </footer>
  );
}

export default Footer;