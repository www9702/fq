"""
任务名称
name: script name
定时规则
cron: 8 6,9,15,20 * * *
"""
import notify

print("test script")
notify.send('test script', 'test desc')
