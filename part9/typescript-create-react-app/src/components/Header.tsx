interface HeaderProps {
  name: string;
}

const Header = ({ name }: HeaderProps): JSX.Element => {
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
};

export default Header;
