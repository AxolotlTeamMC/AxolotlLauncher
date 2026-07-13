use tauri::{AppHandle, Emitter, Manager, WebviewUrl, WebviewWindowBuilder};

#[tauri::command]
pub async fn open_popup_window(
  app: AppHandle,
  label: String,
  pos_x: f64,
  pos_y: f64,
  route_name: String,
  width: f64,
  height: f64,
) -> Result<(), String> {
  // Страховка: если окно вдруг уже есть в системе — просто выходим
  if let Some(_) = app.get_webview_window(&label) {
    return Ok(());
  }

  // ТВОЙ РАБОЧИЙ ВАРИАНТ ФОРМИРОВАНИЯ ССЫЛКИ (НЕ ТРОГАЕМ):
  let base_url = "index.html#/";
  let mut full_url = String::with_capacity(base_url.len() + label.len());
  full_url.push_str(base_url);
  full_url.push_str(&route_name);
  let popup_url = WebviewUrl::App(full_url.into());

  let title_clone = label.clone();
  let app_clone = app.clone();
  let main_window = app_clone.get_webview_window("main").expect("Главное окно не найдено");


  // Создаем окно строго в главном UI-потоке ОС Windows
  app.run_on_main_thread(move || {
    let popup = WebviewWindowBuilder::new(&app_clone, &title_clone, popup_url)
      .parent(&main_window).unwrap()
      .decorations(false)
      .skip_taskbar(true)
      .resizable(false)
      .transparent(true)
      .shadow(false)
      .visible(true)
      .focused(true)
      .devtools(true)
      .inner_size(width, height)
      .position(pos_x, pos_y)
      .build()
      .expect("Не удалось создать попап-окно");

    #[cfg(target_os = "windows")]
    unsafe {
      use windows::Win32::Foundation::HWND;
      use windows::Win32::Graphics::Dwm::*;
      if let Ok(hwnd) = popup.hwnd() {
        let transparent_color: u32 = 0xFFFFFFFE;
        let _ = DwmSetWindowAttribute(
          HWND(hwnd.0),
          DWMWA_BORDER_COLOR,
          &transparent_color as *const u32 as *const _,
          std::mem::size_of::<u32>() as u32,
        );
      }
    }

    // 🟢 ШАГ 1: УМНЫЙ СИСТЕМНЫЙ РАСФОКУС
    let popup_close_clone = popup.clone();
    let app_event_handle = app_clone.clone();

    popup.on_window_event(move |event| {
      if let tauri::WindowEvent::Focused(false) = event {
        let app_handle = app_event_handle.clone();
        let window_to_close = popup_close_clone.clone();

        // Проверяем в главном потоке ОС, куда перешел фокус Windows
        // app_event_handle.run_on_main_thread(move || {
        //   if let Some(main_win) = app_handle.get_webview_window("main") {
        //     if let Ok(true) = main_win.is_focused() {
        //       // Если фокус ушел на наше главное окно лаунчера — Rust МОЛЧИТ!
        //       // Это убирает гонку потоков, из-за которой кнопка сходила с ума.
        //       println!("[Rust] Расфокус проигнорирован: фокус остался внутри лаунчера.");
        //       return;
        //     }
        //   }
        //
        //   // Если главное окно НЕ в фокусе — значит пользователь кликнул по рабочему столу
        //   // или другой программе. Вот теперь честно уничтожаем попап.
        //   println!("[Rust] Клик мимо всего приложения. Закрываем попап.");
        //   let _ = app_handle.emit("profile_popup_destroyed", ()); // оповещаем Angular
        //   let _ = window_to_close.close();
        // }).unwrap();
      }
    });
  }).map_err(|e| e.to_string())?;

  Ok(())
}
