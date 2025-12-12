import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Scale } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-purple-500 via-cyan-500 to-transparent rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2">
            LEGAL AGREEMENT
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-gray-400 text-sm">Last Updated: November 24, 2025</p>
        </div>

        {/* Critical Warning Banner */}
        <Card className="bg-gradient-to-r from-red-900/40 via-orange-900/40 to-red-900/40 border-4 border-red-500/50 p-8 mb-8 backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-12 h-12 text-red-400 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-3 text-red-400">CRITICAL DISCLAIMER</h2>
              <p className="text-gray-300 leading-relaxed">
                Options trading involves substantial risk of loss and is not suitable for all investors. 
                The House provides NO investment advice, NO guarantees, and assumes ZERO liability for your trading decisions or losses. 
                You may lose your entire account. Read carefully.
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-8">
          {/* Section 1 */}
          <Card className="bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-cyan-400">1</span>
              </div>
              <h2 className="text-2xl font-bold">No Financial Advice & No Guarantees</h2>
            </div>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                <strong>THE HOUSE, PROPHET™, AND ALL ASSOCIATED TOOLS, SIGNALS, ANALYSIS, SCORES, METRICS, BACKTESTS, 
                AND CONTENT PROVIDED ON THIS PLATFORM ARE FOR INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY.</strong>
              </p>
              <p>
                Nothing on this platform constitutes investment advice, trading recommendations, financial advice, 
                or any form of professional advisory service. We are not registered investment advisors, brokers, 
                or financial planners. Prophet scores, edge calculations, probability of profit estimates, and all 
                other metrics are algorithmic outputs and do not represent recommendations to buy, sell, or hold 
                any security or derivative.
              </p>
              <p>
                <strong>YOU ARE SOLELY RESPONSIBLE FOR YOUR OWN TRADING DECISIONS AND RESULTS.</strong> Any actions 
                you take based on information from this platform are at your own risk and discretion. We make no 
                guarantees, warranties, or representations regarding the accuracy, completeness, or profitability 
                of any information provided.
              </p>
            </div>
          </Card>

          {/* Section 2 */}
          <Card className="bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-red-400">2</span>
              </div>
              <h2 className="text-2xl font-bold">Zero Liability for Trading Losses</h2>
            </div>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                <strong>THE HOUSE, ITS OWNERS, OPERATORS, EMPLOYEES, CONTRACTORS, AND AFFILIATES SHALL NOT BE LIABLE 
                FOR ANY FINANCIAL LOSSES, LOST PROFITS, TRADING LOSSES, MARGIN CALLS, ACCOUNT LIQUIDATIONS, DRAWDOWNS, 
                OR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE 
                OF THIS PLATFORM — EVEN IF YOU FOLLOWED A PROPHET SIGNAL, STRATEGY, OR RECOMMENDATION EXACTLY.</strong>
              </p>
              <p>
                This includes, but is not limited to: losses from options trades, assignment risk, early exercise, 
                volatility expansion, market gaps, slippage, liquidity issues, broker errors, system outages, data 
                feed failures, incorrect calculations, or any other cause whatsoever.
              </p>
              <p>
                <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS SHALL NOT 
                EXCEED THE AMOUNT YOU PAID FOR YOUR SUBSCRIPTION IN THE PRECEDING 12 MONTHS.</strong>
              </p>
            </div>
          </Card>

          {/* Section 3 */}
          <Card className="bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-purple-400">3</span>
              </div>
              <h2 className="text-2xl font-bold">Data Accuracy Disclaimer</h2>
            </div>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                All market data, stock prices, options chains, implied volatility, gamma exposure, realized volatility, 
                IV skew, backtested results, historical win rates, probability of profit calculations, Prophet Edge Scores, 
                and all other metrics displayed on this platform may contain errors, delays, omissions, or inaccuracies.
              </p>
              <p>
                <strong>WE MAKE NO WARRANTIES OF ANY KIND — EXPRESS, IMPLIED, OR STATUTORY — INCLUDING BUT NOT LIMITED 
                TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, OR NON-INFRINGEMENT.</strong>
              </p>
              <p>
                Third-party data providers may experience outages, delays, or errors. Real-time data may be delayed. 
                Backtested results are hypothetical and may not reflect actual trading conditions. All data is provided 
                "AS IS" and "AS AVAILABLE" without any warranty whatsoever.
              </p>
            </div>
          </Card>

          {/* Section 4 */}
          <Card className="bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-yellow-400">4</span>
              </div>
              <h2 className="text-2xl font-bold">No Performance Guarantees</h2>
            </div>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                <strong>PAST PERFORMANCE IS NOT INDICATIVE OF FUTURE RESULTS.</strong> Historical win rates, 
                backtested performance, average returns, maximum drawdowns, Sharpe ratios, and all other 
                historical metrics are hypothetical and do not guarantee future performance.
              </p>
              <p>
                Market conditions change. Volatility regimes shift. Black swan events occur. Strategies that 
                performed well historically may fail catastrophically in the future. You may lose your entire 
                account balance, and in some cases, you may owe more than your initial investment due to leverage 
                and margin requirements.
              </p>
              <p>
                <strong>NO PROPHET SCORE, EDGE CALCULATION, OR PROBABILITY ESTIMATE GUARANTEES PROFITABILITY.</strong> 
                Even strategies with 90%+ historical win rates can and do experience losing streaks that wipe out 
                accounts.
              </p>
            </div>
          </Card>

          {/* Section 5 */}
          <Card className="bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-red-400">5</span>
              </div>
              <h2 className="text-2xl font-bold">User Acknowledgement of Risk</h2>
            </div>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                <strong>BY USING THIS PLATFORM, YOU EXPLICITLY ACKNOWLEDGE AND AGREE THAT:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Options trading involves substantial risk of loss and is not suitable for all investors.</li>
                <li>You may lose your entire investment and potentially more due to leverage and margin requirements.</li>
                <li>Short options strategies expose you to theoretically unlimited risk.</li>
                <li>Assignment risk, early exercise, and corporate actions can result in unexpected losses.</li>
                <li>You understand the mechanics of options trading including Greeks, time decay, volatility, and risk management.</li>
                <li>You have sufficient capital and risk tolerance for options trading.</li>
                <li>You will not trade with money you cannot afford to lose.</li>
                <li>You are responsible for understanding the tax implications of your trades.</li>
              </ul>
            </div>
          </Card>

          {/* Section 6 */}
          <Card className="bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-cyan-400">6</span>
              </div>
              <h2 className="text-2xl font-bold">Indemnification</h2>
            </div>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                <strong>YOU AGREE TO INDEMNIFY, DEFEND, AND HOLD HARMLESS THE HOUSE, ITS OWNERS, OPERATORS, EMPLOYEES, 
                CONTRACTORS, AFFILIATES, AND SERVICE PROVIDERS FROM AND AGAINST ANY AND ALL CLAIMS, DAMAGES, LOSSES, 
                LIABILITIES, COSTS, AND EXPENSES (INCLUDING REASONABLE ATTORNEYS' FEES) ARISING FROM OR RELATED TO:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your use or misuse of the platform</li>
                <li>Your trading activities and decisions</li>
                <li>Your violation of these Terms of Service</li>
                <li>Your violation of any law or regulation</li>
                <li>Any claims by third parties arising from your actions</li>
                <li>Any regulatory investigations or actions related to your trading</li>
              </ul>
            </div>
          </Card>

          {/* Section 7 */}
          <Card className="bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-purple-400">7</span>
              </div>
              <h2 className="text-2xl font-bold">No Reliance</h2>
            </div>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                <strong>YOU MAY NOT RELY ON PROPHET™, EDGE SCORES, PROBABILITY CALCULATIONS, OR ANY OTHER PLATFORM 
                FEATURE AS THE SOLE OR PRIMARY BASIS FOR ANY TRADING DECISION.</strong>
              </p>
              <p>
                You must conduct your own research, perform your own analysis, and consult with licensed financial 
                professionals before making any investment decisions. The House is not responsible for validating 
                the suitability of any strategy for your specific financial situation, risk tolerance, or investment 
                objectives.
              </p>
              <p>
                Any reliance you place on information from this platform is strictly at your own risk.
              </p>
            </div>
          </Card>

          {/* Section 8 */}
          <Card className="bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-cyan-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-green-400">8</span>
              </div>
              <h2 className="text-2xl font-bold">Subscription & Refund Policy</h2>
            </div>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                <strong>ALL SUBSCRIPTION SALES ARE FINAL.</strong> Once you gain access to the platform, no refunds 
                will be provided, except where required by applicable law.
              </p>
              <p>
                Subscriptions automatically renew each billing period until canceled. You may cancel at any time, 
                but no prorated refunds will be issued for partial billing periods. Access continues until the end 
                of your current billing cycle.
              </p>
              <p>
                Founding Member lifetime pricing is locked for the lifetime of your active subscription. If you 
                cancel and later resubscribe, lifetime pricing is not guaranteed and current rates will apply.
              </p>
              <p>
                We reserve the right to modify subscription prices at any time. Existing subscribers will be 
                notified 30 days prior to any price increases.
              </p>
            </div>
          </Card>

          {/* Section 9 */}
          <Card className="bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-purple-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-red-400">9</span>
              </div>
              <h2 className="text-2xl font-bold">Account Termination Rights</h2>
            </div>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                <strong>WE RESERVE THE RIGHT TO TERMINATE, SUSPEND, OR RESTRICT YOUR ACCOUNT AND ACCESS TO THE 
                PLATFORM AT ANY TIME, FOR ANY REASON OR NO REASON, WITH OR WITHOUT NOTICE, AND WITHOUT REFUND.</strong>
              </p>
              <p>
                This includes, but is not limited to: violations of these Terms, abusive behavior, fraudulent activity, 
                chargebacks, data scraping, reverse engineering, sharing account credentials, or any use we deem 
                inappropriate or harmful to the platform or other users.
              </p>
              <p>
                Upon termination, your right to access the platform immediately ceases. We may delete your account 
                data at any time following termination.
              </p>
            </div>
          </Card>

          {/* Section 10 */}
          <Card className="bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                <Scale className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">Governing Law & Arbitration</h2>
            </div>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                <strong>THESE TERMS SHALL BE GOVERNED BY AND CONSTRUED IN ACCORDANCE WITH THE LAWS OF THE STATE OF 
                TEXAS, WITHOUT REGARD TO CONFLICT OF LAW PRINCIPLES.</strong>
              </p>
              <p>
                <strong>MANDATORY BINDING ARBITRATION:</strong> Any dispute, claim, or controversy arising out of or 
                relating to these Terms or your use of the platform shall be resolved exclusively through binding 
                arbitration administered by the American Arbitration Association (AAA) in accordance with its 
                Commercial Arbitration Rules.
              </p>
              <p>
                Arbitration shall take place in Austin, Texas, or via video conference at the arbitrator's discretion. 
                The arbitrator's decision shall be final and binding, and judgment may be entered in any court of 
                competent jurisdiction.
              </p>
              <p>
                <strong>CLASS ACTION WAIVER:</strong> You agree to arbitrate disputes on an individual basis only. 
                You waive any right to participate in a class action lawsuit or class-wide arbitration against The House.
              </p>
              <p>
                If any provision of this arbitration agreement is found unenforceable, the remainder shall continue 
                in full force and effect.
              </p>
            </div>
          </Card>

          {/* Section 11 */}
          <Card className="bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-red-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-yellow-400">11</span>
              </div>
              <h2 className="text-2xl font-bold">Age & Eligibility</h2>
            </div>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                <strong>YOU MUST BE AT LEAST 18 YEARS OF AGE (OR THE AGE OF MAJORITY IN YOUR JURISDICTION) TO USE 
                THIS PLATFORM.</strong>
              </p>
              <p>
                You represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You are of legal age to enter into this agreement</li>
                <li>You are legally permitted to trade options in your jurisdiction</li>
                <li>You have the authority to bind yourself to these Terms</li>
                <li>Your use of the platform does not violate any applicable laws or regulations</li>
                <li>You are not located in, or a resident of, any jurisdiction where use of this platform is prohibited</li>
              </ul>
              <p>
                We reserve the right to verify your age and identity at any time and to terminate accounts that 
                violate these eligibility requirements.
              </p>
            </div>
          </Card>

          {/* Section 12 */}
          <Card className="bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold">Intellectual Property & DMCA</h2>
            </div>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                <strong>ALL CONTENT, FEATURES, FUNCTIONALITY, ALGORITHMS, SOFTWARE, CODE, DESIGN ELEMENTS, USER INTERFACE, 
                PROPHET™ METHODOLOGY, EDGE SCORE CALCULATIONS, AND ALL OTHER INTELLECTUAL PROPERTY ON THIS PLATFORM ARE 
                THE EXCLUSIVE PROPERTY OF THE HOUSE AND ARE PROTECTED BY U.S. AND INTERNATIONAL COPYRIGHT, TRADEMARK, 
                PATENT, TRADE SECRET, AND OTHER INTELLECTUAL PROPERTY LAWS.</strong>
              </p>
              <p>
                You may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Copy, reproduce, distribute, or create derivative works from any platform content</li>
                <li>Reverse engineer, decompile, or disassemble any software or algorithms</li>
                <li>Scrape, spider, or harvest data from the platform</li>
                <li>Use the platform to create a competing service</li>
                <li>Share, sell, or transfer your account credentials</li>
                <li>Remove or modify any copyright, trademark, or proprietary notices</li>
              </ul>
              <p>
                Violations of intellectual property rights will result in immediate account termination and may be 
                subject to legal action and damages.
              </p>
            </div>
          </Card>

          {/* Section 13 - Red Warning */}
          <Card className="bg-gradient-to-r from-red-900/60 via-red-800/60 to-red-900/60 border-4 border-red-500 p-6 md:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(239,68,68,0.5)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-red-400">13. Prohibition on Reverse Engineering & Algorithm Extraction</h2>
            </div>
            <div className="text-white space-y-3 leading-relaxed">
              <p className="text-lg font-bold">
                <strong>YOU ARE EXPRESSLY PROHIBITED FROM ATTEMPTING TO REVERSE-ENGINEER, DECOMPILE, SCRAPE, OR DERIVE 
                THE SOURCE CODE, MACHINE-LEARNING MODELS, PROPHET EDGE SCORE™ CALCULATION METHODOLOGY, OR ANY 
                PROPRIETARY ALGORITHMS.</strong>
              </p>
              <p className="text-gray-200">
                This includes, but is not limited to: analyzing network traffic, intercepting API calls, automated data 
                extraction, bot usage, screen scraping, pattern analysis to deduce algorithmic logic, or any other 
                technical means to access, copy, or recreate our proprietary systems.
              </p>
              <p className="text-gray-200">
                <strong>VIOLATION WILL RESULT IN IMMEDIATE ACCOUNT TERMINATION WITHOUT REFUND AND THE PURSUIT OF 
                MAXIMUM LEGAL REMEDIES INCLUDING STATUTORY DAMAGES UNDER 17 U.S.C. § 1201 (DMCA), INJUNCTIVE RELIEF, 
                AND RECOVERY OF ALL ATTORNEYS' FEES AND COSTS.</strong>
              </p>
              <p className="text-gray-200">
                We employ advanced monitoring systems to detect unauthorized access attempts. Any breach will be 
                prosecuted to the fullest extent of the law.
              </p>
            </div>
          </Card>

          {/* Final Agreement Banner */}
          <Card className="bg-gradient-to-r from-cyan-900/40 via-purple-900/40 to-cyan-900/40 border-4 border-cyan-500/50 p-8 backdrop-blur-xl">
            <div className="text-center">
              <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-cyan-400">Acceptance of Terms</h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                <strong>BY CREATING AN ACCOUNT, ACCESSING THE PLATFORM, OR USING PROPHET™, YOU ACKNOWLEDGE THAT 
                YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.</strong>
              </p>
              <p className="text-lg text-gray-400 mt-4">
                YOU FURTHER ACKNOWLEDGE THAT YOU ALONE ARE RESPONSIBLE FOR YOUR TRADING DECISIONS, RESULTS, 
                AND ACCEPT ALL RISKS ASSOCIATED WITH OPTIONS TRADING.
              </p>
              <div className="mt-6 p-4 bg-black/50 border-2 border-cyan-500/50 rounded-lg">
                <p className="text-sm text-gray-300">
                  If you do not agree to these Terms, you must immediately cease using the platform and contact 
                  support to close your account.
                </p>
              </div>
            </div>
          </Card>

          {/* Contact & Updates */}
          <Card className="bg-white/5 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
            <h2 className="text-2xl font-bold mb-4">Changes to Terms & Contact</h2>
            <div className="text-gray-300 space-y-3 leading-relaxed">
              <p>
                We reserve the right to modify these Terms of Service at any time. Changes will be posted on this 
                page with an updated "Last Updated" date. Your continued use of the platform after changes are 
                posted constitutes acceptance of the modified Terms.
              </p>
              <p>
                For questions about these Terms, contact us at: <strong className="text-cyan-400">legal@thehouse.io</strong>
              </p>
              <p className="text-sm text-gray-500 mt-6">
                These Terms of Service constitute the entire agreement between you and The House regarding your use 
                of the platform and supersede all prior agreements and understandings.
              </p>
            </div>
          </Card>

          {/* Print-Friendly Notice */}
          <div className="text-center text-xs text-gray-500 print:block">
            <p>This document is designed to be printer-friendly. Use your browser's print function to save a copy.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .fixed { position: static !important; }
          .backdrop-blur-xl { backdrop-filter: none !important; }
          .bg-gradient-to-r, .bg-gradient-to-br, .bg-gradient-to-tl { 
            background: white !important; 
            color: black !important; 
          }
        }
      `}</style>
    </div>
  );
}