import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'al-minecraft-head',
  standalone: true,
  templateUrl: 'minecraft-head.component.html',
  styleUrls: ['minecraft-head.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class MinecraftHeadComponent  {
  readonly skinUrl = input('http://textures.minecraft.net/texture/e82cae516afd480338b8c046ed80112e354fc23c13496dcf1436ab5ea60238aa');
  readonly size = input('16px');
}
