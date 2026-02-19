package com.ToolRent.ToolRent.Service;
import com.ToolRent.ToolRent.Entity.KardexEntity;
import com.ToolRent.ToolRent.Entity.ToolsEntity;
import com.ToolRent.ToolRent.Repository.KardexRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class KardexService {

    @Autowired
    private KardexRepository kardexRepository;

    public KardexEntity save(KardexEntity movement) {
        return kardexRepository.save(movement);
    }


    public List<KardexEntity> getMovementsByTool(ToolsEntity tool) {
        return kardexRepository.findByTool(tool);
    }

    public List<KardexEntity> getMovementsByDateRange(LocalDateTime start, LocalDateTime end) {
        return kardexRepository.findByDateTimeBetween(start, end);
    }
}
