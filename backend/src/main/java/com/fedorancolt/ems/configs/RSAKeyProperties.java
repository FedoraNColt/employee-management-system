package com.fedorancolt.ems.configs;

import com.fedorancolt.ems.utils.KeyGeneratorUtil;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

@Component
@Getter
@Setter
public class RSAKeyProperties {

    private RSAPublicKey publicKey;
    private RSAPrivateKey privateKey;

    public RSAKeyProperties() {
        KeyPair keyPair = KeyGeneratorUtil.generateRsaKey();
        this.publicKey = (RSAPublicKey) keyPair.getPublic();
        this.privateKey = (RSAPrivateKey) keyPair.getPrivate();
    }

}
