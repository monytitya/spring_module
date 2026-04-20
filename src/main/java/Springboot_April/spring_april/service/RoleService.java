package Springboot_April.spring_april.service;

import Springboot_April.spring_april.dto.RoleResponse;
import Springboot_April.spring_april.mapper.RoleMapper;
import Springboot_April.spring_april.model.Role;
import Springboot_April.spring_april.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toResponse)
                .toList();
    }

    public RoleResponse getRoleById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        return roleMapper.toResponse(role);
    }

    @Transactional
    public RoleResponse createRole(Role role) {
        return roleMapper.toResponse(roleRepository.save(role));
    }

    @Transactional
    public RoleResponse updateRole(Long id, Role details) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        role.setName(details.getName());
        role.setDescription(details.getDescription());
        return roleMapper.toResponse(roleRepository.save(role));
    }

    @Transactional
    public void deleteRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new RuntimeException("Role not found");
        }
        roleRepository.deleteById(id);
    }
}
