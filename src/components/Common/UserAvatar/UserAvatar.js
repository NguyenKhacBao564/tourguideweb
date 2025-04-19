import React from 'react';
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';

function UserAvatar(props) {

    const {image, name, size} = props;

    return (
        <Container className="flex-center gap-3" style={{height: "100%"}}>
            {name && <span style={{color: "black"}}>{name}</span>}
            <Image src={image} roundedCircle style={{width: `${size}`}}/>
        </Container>
    );
}

export default UserAvatar;