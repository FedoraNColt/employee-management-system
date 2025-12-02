package com.fedorancolt.ems.services;

import com.fedorancolt.ems.entities.PayInformation;
import com.fedorancolt.ems.repositories.PayInformationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class PayInformationService {

    private final PayInformationRepository payInformationRepository;

    public PayInformation createPayInformation(PayInformation payInformation) {
        return payInformationRepository.save(payInformation);
    }

}
