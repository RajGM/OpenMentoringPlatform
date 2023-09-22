import CategoryBar from "@components/CategoryBar.tsx"
import MainFeed from "@components/MainFeed";

const Opp = () => {

  return (
    <div className="middle">
      <div className="childDiv">
        <CategoryBar />
      </div>
      <div className="childDiv">
        <MainFeed />
      </div>
    </div>
  )
}

export default Opp