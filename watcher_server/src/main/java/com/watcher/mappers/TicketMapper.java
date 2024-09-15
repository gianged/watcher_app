package com.watcher.mappers;

import com.watcher.dto.TicketDto;
import com.watcher.models.Ticket;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface TicketMapper {
    @Mapping(source = "userId", target = "user.id")
    Ticket toEntityFromTicketDto(TicketDto ticketDto);

    @Mapping(source = "user.id", target = "userId")
    TicketDto toTicketDto(Ticket ticket);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "userId", target = "user.id")
    Ticket partialUpdate(TicketDto ticketDto, @MappingTarget Ticket ticket);
}