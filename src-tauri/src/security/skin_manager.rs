use url::Url;

pub enum SkinType {
  Slim,
  Normal
}

pub struct Skin {
  id: String,
  name: String,
  skin_type: SkinType,
}

pub struct SkinManager {
  url: Url,
  skins: Vec<Skin>,
}
