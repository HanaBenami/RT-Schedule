interface PhoneCallLinkProps extends React.PropsWithChildren {
    phone: string;
}

function PhoneCallLink({ phone, children }: PhoneCallLinkProps) {
    const phoneCallURL = "tel:" + phone.replace(/[-\s]/g, "");

    return (
        <a href={phoneCallURL} target="_blank" rel="noreferrer">
            {children}
        </a>
    );
}

export default PhoneCallLink;
