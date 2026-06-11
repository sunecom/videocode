/**
 * VideoCode Standard Parser v1.0
 * Converts VideoCode Drive Schema into engine-specific drive commands.
 */

class VideoCodeParser {
    constructor(model, mappingProfile = 'mixamo') {
        this.model = model;
        this.mapping = this.getMapping(mappingProfile);
    }

    // 获取映射配置
    getMapping(profile) {
        const profiles = {
            'mixamo': {
                headBone: 'mixamorig:Head',
                morphs: { mouth_open: 'jawOpen', eye_blink_left: 'eyeBlinkLeft' }
            },
            'vrm': {
                headBone: 'head',
                morphs: { mouth_open: 'A', eye_blink_left: 'BlinkLeft' }
            }
        };
        return profiles[profile] || profiles['mixamo'];
    }

    // 核心解析方法
    applySchema(schema) {
        if (!this.model) return;

        // 1. 驱动姿态 (Pose)
        if (schema.pose && schema.pose.head) {
            const bone = this.model.getObjectByName(this.mapping.headBone);
            if (bone) {
                bone.rotation.x = schema.pose.head.rotation.x;
                bone.rotation.y = schema.pose.head.rotation.y;
                bone.rotation.z = schema.pose.head.rotation.z;
            }
        }

        // 2. 驱动表情 (Expression)
        if (schema.expression && this.model.morphTargetDictionary) {
            for (const [key, value] of Object.entries(schema.expression)) {
                const morphName = this.mapping.morphs[key];
                if (morphName && this.model.morphTargetDictionary[morphName] !== undefined) {
                    this.model.morphTargetInfluences[this.model.morphTargetDictionary[morphName]] = value;
                }
            }
        }
    }
}

// 导出供 Decoder 使用
if (typeof module !== 'undefined') module.exports = VideoCodeParser;