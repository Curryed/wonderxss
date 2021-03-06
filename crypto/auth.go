package crypto

import (
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/edznux/wonderxss/config"
	"github.com/edznux/wonderxss/storage/models"
)

func GetJWTToken(user models.User, verified bool) (string, error) {
	signingKey := []byte(config.Current.JWTToken)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":     user.ID,
		"role":        "admin",  // maybe we will add authz later on.
		"2FAVerified": verified, // This token will be test further down if the user as 2FA enabled.
		"exp":         time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString(signingKey)
	return tokenString, err
}

func VerifyJWTToken(tokenString string) (jwt.Claims, error) {
	signingKey := []byte(config.Current.JWTToken)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return signingKey, nil
	})

	if err != nil {
		return nil, err
	}

	data := token.Claims.(jwt.MapClaims)
	ts := int64(data["exp"].(float64))
	now := time.Now().Unix()
	diff := (ts - now)
	fmt.Println("Token exp:", ts, "now is: ", now, "diff :", diff)

	isValid := data.VerifyExpiresAt(now, true)
	if !isValid {
		return nil, fmt.Errorf("Token is expired")
	}
	return token.Claims, err
}
