package Springboot_April.spring_april.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "role_permission", 
       uniqueConstraints = {@UniqueConstraint(name = "uq_role_module_action", columnNames = {"role_id", "module", "action"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RolePermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(nullable = false, length = 50)
    private String module;

    @Column(nullable = false, length = 50)
    private String action;
}
