import React from 'react';

function SocialLogin(props) {
    return (
        <div className="socialLogin">
            <button>
                <img alt="anh1" src="./google.png" />
            </button>
            <button>
                <img alt="anh2" src="./facebook.png"/>
            </button>
        </div>
    );
}

export default SocialLogin;