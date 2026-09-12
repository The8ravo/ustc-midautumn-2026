(() => {
  const dialog = document.querySelector('#payment-dialog');
  let opener;
  let ticketPromise;
  async function openTicket(button) {
    opener = button;
    button.disabled = true;
    try {
      ticketPromise ||= Promise.resolve(JSON.parse(document.querySelector('#local-ticket-data').textContent));
      const tickets = await ticketPromise;
      const ticket = tickets.find(t => t.id === button.dataset.ticket);
      if (!ticket) throw new Error('ticket');
      document.querySelector('#payment-selection').textContent = `${ticket.name} · $${ticket.price.toLocaleString('en-US')} USD`;
      document.querySelector('#payment-description').textContent = ticket.existing ? (ticket.id === 'run' ? '晨跑的集合点和路线待公布。请在 Zeffy 核对活动权益、数量及最终总额后付款。' : '请先核对：本页拟定方案含 10 道川菜中餐；原 Zeffy 票种仍写“晚餐”。请向主办方确认后再付款。') : '此为拟定票价与权益，尚未开放在线购买。票种与嘉宾安排确认后将在此更新。';
      document.querySelector('#zeffy-pay').hidden = !ticket.existing;
      document.querySelector('#zeffy-pending').hidden = ticket.existing;
      dialog.showModal();
    } catch (err) {
      document.querySelector('#payment-selection').textContent = '报名信息暂时无法加载';
      document.querySelector('#payment-description').textContent = '请关闭窗口重试，或前往原活动页查看已开放的票种。';
      document.querySelector('#zeffy-pay').hidden = false;
      document.querySelector('#zeffy-pending').hidden = true;
      dialog.showModal();
    } finally {button.disabled = false;}
  }
  document.querySelectorAll('[data-ticket]').forEach(button => button.addEventListener('click', () => openTicket(button)));
  document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {if(event.target === dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
  dialog.addEventListener('close', () => {if(opener) opener.focus();});
})();
