package com.fedorancolt.ems.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@ToString
@MappedSuperclass
public class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @CreationTimestamp
    @Column(name = "create_ts", nullable = false, updatable = false)
    @JsonIgnore
    private Instant createdTimeStamp;

    @UpdateTimestamp
    @Column(name = "update_ts", nullable = false)
    @JsonIgnore
    private Instant updatedTimeStamp;

}
