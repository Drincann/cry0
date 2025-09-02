import { Command } from 'commander'
import { printer } from '../../output/index.mjs'
import { createProvider } from '../../../integration/provider.mjs'

export const txBroadcastCommand = new Command()
  .name('broadcast')
  .description('Broadcast a signed transaction')

  .requiredOption('--tx <tx-content>', 'signed transaction content')
  .option('--provider <provider-name-or-url>', 'provider name or url')

  .action(async (opts, cmd) => {
    try {
      const tx = opts.tx
      const provider = createProvider(opts.provider)
      printer.info('Broadcasting transaction to ' + opts.provider)
      printer.info(await provider.broadcast(tx))
    } catch (e: unknown) {
      printer.error((e as any)?.message ?? 'unknown error')
    }
  })


