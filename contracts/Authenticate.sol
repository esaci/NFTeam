// SPDX-Licence-identifier : MIT
pragma solidity ^0.8.6;

contract NFTeamAuth {
    address admin;
    address NFTeam_token;
    uint256 nextUser;

    struct User {
        uint256 id;
        bool isArtist;
        address wallet;
        bytes32 userName; //Spotify userName
    }

    mapping(bytes32 => User) users;
    mapping(address => bool) isAuthenticated;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not an admin");
        _;
    }

    modifier onlyAuthenticated(address _user){
        require(isAuthenticated[_user], "You must authenticate");
        _;
    }

    event userAdded(address userWallet, bytes32 userName, bool isArtist);
    constructor(address _tokenAddress){
        admin = msg.sender;
        NFTeam_token = _tokenAddress;
    }

    function addUser(address _userWallet, bytes32 _userName, bool _isArtist) onlyAdmin external {
        require(isAuthenticated[_userWallet] == false, "user already exists");
        users[_userName] = User(nextUser, _isArtist, _userWallet, _userName );
        isAuthenticated[_userWallet] = true;
        nextUser++;
    }
}