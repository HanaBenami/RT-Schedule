type IconProps = {
    icon: string, 
    onClick?: React.MouseEventHandler
}

function Icon({ icon, onClick } : IconProps) {
    return <i className={`fa-solid ${icon}`} onClick={onClick} />;
}

export default Icon;
