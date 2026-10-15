package com.outerrim.workshop.parts;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PartService {
private final List<Part> parts = List.of(
        new Part("alloy","Ribbed Alloy", "#273c2b"),
        new Part("brass", "Salvaged Brass", "#c49e5b"),
        new Part("steel","Machined Steel","#b5c0c9"),
        new Part("wood","Wookie Wood","#6c4223"),
        new Part("gold","Golden Plated","#ffc30b")
        );

public List<Part> getAllParts() {
    return parts;
}
}
