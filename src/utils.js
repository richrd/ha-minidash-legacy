
export function getEntityIcon(entity) {
  let icon = "checkbox-blank";

  if (entity.attributes.icon) {
    icon = entity.attributes.icon.split(':')[1]
  } else if (entity.entity_id.startsWith('switch.')) {
    icon = 'toggle-switch-off';
    if ( entity.state === 'on' ) {
      icon = 'toggle-switch';
    }
  } else if (entity.entity_id.startsWith('light.')) {
    icon = 'lightbulb';
    if ( entity.state === 'on' ) {
      icon = 'lightbulb-on';
    }
  }

  return icon;
}
