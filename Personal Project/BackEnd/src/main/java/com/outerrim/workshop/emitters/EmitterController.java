package com.outerrim.workshop.emitters;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class EmitterController {

    private final EmitterService emitterService;

    public EmitterController(EmitterService emitterService) {
        this.emitterService = emitterService;
    }

    @GetMapping(
    value ="/api/emitters.sbr",
    produces = MediaType.APPLICATION_JSON_VALUE
    )

    public List<Emitter> getEmitters() {
        return emitterService.getAllEmitters();
    }

}
