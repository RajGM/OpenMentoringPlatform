import Image from "next/image";

export default function MentorTile({ data }: any) {
  
  return (
    <div className="flex items-center justify-center">
      <div className="card bordered max-w-xs w-96 min-w-64">
        <figure style={{ marginTop: "10px" }}>
          <Image
            className="rounded-full mx-auto"
            src={
              data.photoURL ||
              "https://www.gravatar.com/avatar/2acfb745ecf9d4dccb3364752d17f65f?s=260&d=mp"
            }
            alt={data.displayName || "John Doe"}
            width={128} // width in pixels
            height={128} // height in pixels
            layout="fixed"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-center text-xl">
            {data.displayName || "Mentor @ FOSS Mentoring"}
          </h2>
          <p className="text-center text-gray-400 text-xs font-semibold">
            {data.major || "Computer Science"}
          </p>
          <div className="divider"></div>
          <table className="table w-full table-compact">
            <tbody>
              <tr>
                <td className="text-gray-500 font-semibold">Country</td>
                <td>{data.country || "Chatakpur-3"}</td>
              </tr>
              <tr>
                <td className="text-gray-500 font-semibold">University</td>
                <td>{data.university || "University to be added"}</td>
              </tr>
              <tr>
                <td className="text-gray-500 font-semibold">Email</td>
                <td>{data.email || "rajgm1722@gmail.com"}</td>
              </tr>
            </tbody>
          </table>
          <div className="justify-center card-actions">
            <a className="btn btn-primary" href={data.username || "#"}>
              View Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
