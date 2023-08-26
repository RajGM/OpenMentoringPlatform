import Link from "next/link";

export default async function Header() {
  return (
    <div className="navbar bg-info text-primary-content">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">FOSS Mentoring</a>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <Link href="/chat" className="justify-between">
                Chat
              </Link>
            </li>
            <li>
              <Link href="/mentors" className="justify-between">
                Listing
              </Link>
            </li>
            <li>
              <Link href="/kanban" className="justify-between">
                Kanban
              </Link>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
