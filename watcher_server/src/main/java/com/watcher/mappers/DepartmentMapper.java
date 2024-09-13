package com.watcher.mappers;

import com.watcher.dto.DepartmentDto;
import com.watcher.models.Department;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface DepartmentMapper {

    Department toEntityFromDepartmentDto(DepartmentDto departmentDto);

    DepartmentDto toDepartmentDto(Department department);

    @Mapping(target = "id", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(DepartmentDto departmentDto, @MappingTarget Department department);
}
