import './NavBar.css'

const NavBar = () => {

  return (
      <div className="nav-container">
        <nav className="nav-item">
          <button>
            주문 내역
          </button>
        </nav>
        <nav className="nav-item">
          <button>
          마이 메뉴
          </button>
        </nav>
        <nav className="nav-item">
          <button>
          마이 스토어 설정
          </button>
        </nav>
        <nav className="nav-item">
          <button>
          내 계정 정보
          </button>
        </nav>
      </div>
  )
}

export default NavBar
