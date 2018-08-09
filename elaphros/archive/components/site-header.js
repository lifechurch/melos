import HomeIcon from './home-icon'
import ReaderIcon from './reader-icon'
import PlansIcon from './plans-icon'
import VideosIcon from './videos-icon'
import SearchIcon from './search-icon'

export default () => (
  <header className="bg-white pa3 fixed top-0 left-0 w-100 bb b--moon-gray z-1 flex items-center">
    <nav className="flex items-center w-100">
      <a href="/" className="link dim">
        <div className="flex flex-column items-center mr4">
          <HomeIcon />
          <p className="pa0 ma0 f7 silver mt1">Home</p>
        </div>
      </a>
      <a href="/bible/111/JHN.1" className="link dim">
        <div className="flex flex-column items-center mr4">
          <ReaderIcon />
          <p className="pa0 ma0 f7 silver mt1">Read</p>
        </div>
      </a>
      <a href="/reading-plans/11467-how-sweet-the-sound" className="link dim">
        <div className="flex flex-column items-center mr4">
          <PlansIcon />
          <p className="pa0 ma0 f7 silver mt1">Plans</p>
        </div>
      </a>
      <a href="/videos" className="link dim">
        <div className="flex flex-column items-center mr4">
          <VideosIcon />
          <p className="pa0 ma0 f7 silver mt1">Videos</p>
        </div>
      </a>
    </nav>
    <div>
      <a href="#" className="bg-white pv2 ph4 br2 ba silver b--moon-gray f7 link mr3 nowrap dim">Sign In</a>
      <a href="#" className="bg-white pv2 ph4 br2 ba silver b--moon-gray f7 link nowrap dim">Sign Up</a>
    </div>
    <div className="absolute left-0 right-0 flex" style={{ pointerEvents:'none' }}>
      <div className="center">
        <div className="ba b--moon-gray pa2 f6 silver br2 flex" style={{ pointerEvents:'auto' }}>
          <SearchIcon  />
          <input className="ml2 bn w-90 outline-0 " placeholder="Search..." />
        </div>
      </div>
    </div>
  </header>
)
