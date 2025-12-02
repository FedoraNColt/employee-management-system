package com.fedorancolt.ems.repositories;

import com.fedorancolt.ems.entities.ContactInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ContactInformationRepository extends JpaRepository<ContactInformation, UUID> {
}
