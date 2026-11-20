<script setup lang="ts">
import Logo from './Logo.vue';
import { dot, dotPath, dotWidth, left, leftPath, strokeWidth, vertex } from './logo';

// The left arm's free end travels cap → vertex → cap.
const leftArm = {
  x: [left.x, vertex.x, vertex.x, left.x].join(';'),
  y: [left.y, vertex.y, vertex.y, left.y].join(';'),
};

// Both ends of the right arm travel vertex → dot → vertex, offset in time so it stretches then shrinks.
const rightArm = {
  x: [vertex.x, vertex.x, dot.x, dot.x, vertex.x, vertex.x].join(';'),
  y: [vertex.y, vertex.y, dot.y, dot.y, vertex.y, vertex.y].join(';'),
};

const dur = '1.5s';
const leftTiming = { keyTimes: '0;.25;.75;1', keySplines: '1 0 .8 .6; 0 0 0 0; 0 .6 0 1' };
const rightStart = { keyTimes: '0;.25;.48;.5;.75;1', keySplines: '0 0 0 0; 0 0.5 0 1; 0 0 0 0; .7 0 .8 .6; 0 0 0 0' };
const rightEnd = { keyTimes: '0;.3;.48;.6;.75;1', keySplines: '0 0 0 0; 0 0.7 0 1; 0 0 0 0; 1 0 .8 .6; 0 0 0 0' };
</script>

<template>
  <Logo class="motion-reduce:animate-pulse">
    <g class="motion-reduce:hidden">
      <line :x1="left.x" :y1="left.y" :x2="left.x" :y2="left.y" :stroke-width="strokeWidth" stroke="white" stroke-linecap="round">
        <animate attributeName="x2" :dur="dur" repeatCount="indefinite" calcMode="spline" :values="leftArm.x" v-bind="leftTiming" />
        <animate attributeName="y2" :dur="dur" repeatCount="indefinite" calcMode="spline" :values="leftArm.y" v-bind="leftTiming" />
      </line>
      <!-- A line rather than the mark's dot, so it can slide from the vertex up to the dot's resting place. -->
      <line :x1="vertex.x" :y1="vertex.y" :x2="vertex.x" :y2="vertex.y" opacity="0" :stroke-width="dotWidth" stroke="white" stroke-linecap="round">
        <animate attributeName="x1" :dur="dur" repeatCount="indefinite" calcMode="spline" :values="rightArm.x" v-bind="rightStart" />
        <animate attributeName="y1" :dur="dur" repeatCount="indefinite" calcMode="spline" :values="rightArm.y" v-bind="rightStart" />
        <animate attributeName="x2" :dur="dur" repeatCount="indefinite" calcMode="spline" :values="rightArm.x" v-bind="rightEnd" />
        <animate attributeName="y2" :dur="dur" repeatCount="indefinite" calcMode="spline" :values="rightArm.y" v-bind="rightEnd" />
        <animate attributeName="opacity" :dur="dur" repeatCount="indefinite" values="0;0;1;1;0;0" keyTimes="0;.24;.26;.75;.75;1" />
      </line>
    </g>
    <!-- SMIL ignores the reduced motion setting, so the still mark stands in and pulses. -->
    <g class="hidden motion-reduce:inline">
      <path :d="leftPath" :stroke-width="strokeWidth" stroke-linecap="round" stroke="white" />
      <path :d="dotPath" :stroke-width="dotWidth" stroke-linecap="round" stroke="white" />
    </g>
  </Logo>
</template>
