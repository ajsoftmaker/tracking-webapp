package com.tracking.auth;

import java.security.Key;
import java.util.Arrays;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;
import com.google.gson.Gson;
import com.tracking.entity.TrackingUser;
import io.dropwizard.auth.AuthenticationException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

public class JwtToken {
	private static String delimiter = "~!@#";
	private static String keyStr = "58fd59bbc27647bb891dd4cca0d9295b";
	private static Key key = new SecretKeySpec(Arrays.copyOf(Base64.decodeBase64(keyStr), 16), "AES");
	private static Gson gson = new Gson();
	
	private JwtToken() {
		
	}
	public static String decryptHeader(String encryptedMessage) throws Exception {
		try {
			Jws<Claims> ans = Jwts.parser().setSigningKey(key).parseClaimsJws(encryptedMessage);
			return ans.getHeader().get("authorization").toString();
		} catch (Exception ex) {
			throw new AuthenticationException(ex);
		}
	}

	public static String generateToken(String emailid, TrackingUser user) throws Exception {
		try {
			String s = Jwts.builder().setHeaderParam("authorization", emailid).setPayload(gson.toJson(user))
					.signWith(SignatureAlgorithm.HS256, key).compact();
			return s;
		} catch (Exception ex) {
			throw new AuthenticationException(ex);
		}
	}

	public static TrackingUser decryptPayload(String encryptedMessage) throws Exception {
		try {
			Jws<Claims> ans = Jwts.parser().setSigningKey(key).parseClaimsJws(encryptedMessage);
			String str = gson.toJson(ans.getBody());
			return gson.fromJson(str, TrackingUser.class);
		} catch (Exception ex) {
			throw new AuthenticationException(ex);
		}
	}

	public static String[] getUserInfo(String decryptedHeader) {
		return decryptedHeader.split(delimiter);
	}

}
